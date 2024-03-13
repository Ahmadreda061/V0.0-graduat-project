using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SynergicAPI.Models;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;
using System.Reflection.PortableExecutable;

namespace SynergicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public ServicesController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        [HttpPost]
        [Route("AddService")]
        public DefaultResponse AddService(SynergicService service)
        {
            DefaultResponse response = new DefaultResponse();

            if(service.Images.Length < 0)
            {
                response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                response.statusMessage = "Service Error: You need one or more Images for the Service!";
            }
            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                if (isLegitUser(con, service.user, out SqlDataReader reader))
                {
                    string InsertServiceQuery = $"INSERT INTO {Utils.ServicesString} " +
                                                           "VALUES (@OwnerID, @ServiceTitle, @ServicePrice, @ServiceDescription, @ServiceCategory)";

                    int userID = (int)reader["ID"];
                    using (SqlCommand insertCommand = new SqlCommand(InsertServiceQuery, con))
                    {
                        insertCommand.Parameters.AddWithValue("@OwnerID", userID);
                        insertCommand.Parameters.AddWithValue("@ServiceTitle", service.Title);
                        insertCommand.Parameters.AddWithValue("@ServicePrice", service.Price);
                        insertCommand.Parameters.AddWithValue("@ServiceDescription", service.Description);
                        insertCommand.Parameters.AddWithValue("@ServiceCategory", service.Category);

                        int rowsAffected = insertCommand.ExecuteNonQuery();

                        if (rowsAffected <= 0)//Query failed to execute.
                        {
                            response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                            response.statusMessage = "Service Error: An unexpected error has occurred while registering the Service!";
                        }
                    }
                    int ServiceID = GetServiceID(con, service, userID);

                    string InsertServiceImagesQuery = $"INSERT INTO {Utils.ServicesImagesString} " +
                   "VALUES (@ServiceID, @ImageData)";
                    foreach (var img in service.Images)
                    {
                        using (SqlCommand insertImageCommand = new SqlCommand(InsertServiceImagesQuery, con))
                        {
                            insertImageCommand.Parameters.AddWithValue("@ServiceID", ServiceID);
                            insertImageCommand.Parameters.AddWithValue("@ImageData", Utils.BitmapToByteArray(img));

                            int rowsAffected = insertImageCommand.ExecuteNonQuery();
                        }
                    }
                }
                else
                {
                    response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                    response.statusMessage = "The password doesn't match with the expected one for the UserToken.";
                }
                reader.Close();
            }
            return response;
        }

        bool isLegitUser(SqlConnection connection, SynergicUser user, out SqlDataReader reader)
        {
            string query = "SELECT * FROM UserAccount WHERE UserToken = @UserToken AND Password = @Password";
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@UserToken", user.UserToken);
                command.Parameters.AddWithValue("@Password", Utils.HashString(user.Password, "SynergicPasswordHashSalt"));
                int count = (int)command.ExecuteScalar();
                reader = command.ExecuteReader();
                return count > 0;
            }
        }
        int GetServiceID(SqlConnection connection, SynergicService service, int UserID)
        {
            int serviceID = -1;

            string query = $"SELECT * FROM {Utils.ServicesString} WHERE OwnerID = @OwnerID AND ServiceTitle = @ServiceTitle AND ServicePrice = @ServicePrice AND ServiceDescription = @ServiceDescription AND ServiceCategory = @ServiceCategory";
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@OwnerID", UserID);
                command.Parameters.AddWithValue("@ServiceTitle", service.Title);
                command.Parameters.AddWithValue("@ServicePrice", service.Price);
                command.Parameters.AddWithValue("@ServiceDescription", service.Description);
                command.Parameters.AddWithValue("@ServiceCategory", service.Category);

                int count = (int)command.ExecuteScalar();
                var reader = command.ExecuteReader();
                serviceID = (int)reader["ServiceID"];
                reader.Close();
            }

            return serviceID;
        }
    }
}
