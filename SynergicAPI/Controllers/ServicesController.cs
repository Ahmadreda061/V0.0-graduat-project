using Microsoft.AspNetCore.Mvc;
using SynergicAPI.Models;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;

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

                int userID;
                if (isLegitUserWithID(con, service.user, out userID))
                {
                    string InsertServiceQuery = $"INSERT INTO {Utils.ServicesString} " +
                                                           "VALUES (@OwnerID, @ServiceTitle, @ServicePrice, @ServiceDescription, @ServiceCategory)";

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
                            insertImageCommand.Parameters.AddWithValue("@ImageData", img);//converting the img base64 into byte[]
                            insertImageCommand.ExecuteNonQuery();
                        }
                    }
                }
                else
                {
                    response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                    response.statusMessage = "The password doesn't match with the expected one for the UserToken.";
                }
            }
            return response;
        }

        [HttpGet]
        [Route("GetServices")]
        public ServiceElementResponse[] GetServices(string? Username, string? Title, int? Price, int? Category, int Count, int Offset)
        {
            List<ServiceElementResponse> response = new List<ServiceElementResponse>();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                if (Count > 0)
                {
                    string query = $"SELECT * FROM Services ";
                    if (!string.IsNullOrEmpty(Title) || !string.IsNullOrEmpty(Username) || Price > 0 || Category > -1) query += "WHERE ";

                    if (!string.IsNullOrEmpty(Title)) query += "(ServiceTitle LIKE @ServiceTitle OR ServiceDescription LIKE @ServiceDescription) AND ";
                    if (!string.IsNullOrEmpty(Username)) query += "OwnerID IN (SELECT ID FROM UserAccount WHERE Username LIKE @Username) AND ";
                    if (Price > 0) query += "ServicePrice <= @ServicePrice AND ";
                    if (Category > -1) query += "ServiceCategory = @ServiceCategory";

                    // Remove trailing "AND" if it exists
                    query = query.TrimEnd(' ', 'A', 'N', 'D');

                    query += " ORDER BY (SELECT NULL) OFFSET @Offset ROWS FETCH NEXT @Count ROWS ONLY";

                    using (SqlCommand command = new SqlCommand(query, con))
                    {
                        if (!string.IsNullOrEmpty(Title))
                        {
                            command.Parameters.AddWithValue("@ServiceTitle", $"%{Title}%");
                            command.Parameters.AddWithValue("@ServiceDescription", $"%{Title}%");
                        }
                        if (Price > 0) command.Parameters.AddWithValue("@ServicePrice", Price);
                        if (Category > -1) command.Parameters.AddWithValue("@ServiceCategory", Category);
                        if (!string.IsNullOrEmpty(Username)) command.Parameters.AddWithValue("@Username", Username);
                        command.Parameters.AddWithValue("@Offset", Offset);
                        command.Parameters.AddWithValue("@Count", Count);

                        // Load data into a temporary list
                        List<ServiceElementResponse> tempList = new List<ServiceElementResponse>();
                        List<int> OwnersIDs = new List<int>();
                        List<int> ServicesIDs = new List<int>();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ServiceElementResponse card = new ServiceElementResponse();
                                card.Title = (string)reader["ServiceTitle"];
                                card.Price = (int)reader["ServicePrice"];
                                card.Description = (string)reader["ServiceDescription"];
                                card.Category = (int)reader["ServiceCategory"];
                                tempList.Add(card);
                                OwnersIDs.Add((int)reader["OwnerID"]);
                                ServicesIDs.Add((int)reader["ServiceID"]);
                            }
                        }

                        for (int i = 0; i < tempList.Count; i++)
                        {
                            // Initialize ServiceOwner
                            tempList[i].ServiceOwner = new SynergicUser();

                            string getUserCommand = $"SELECT * FROM UserAccount WHERE ID = @OwnerID";
                            using (SqlCommand userCommand = new SqlCommand(getUserCommand, con))
                            {
                                userCommand.Parameters.AddWithValue("@OwnerID", OwnersIDs[i]);

                                using (SqlDataReader userReader = userCommand.ExecuteReader())
                                {
                                    if (userReader.Read())
                                    {
                                        tempList[i].ServiceOwner.Username = (string)userReader["Username"];
                                        tempList[i].ServiceOwner.UserToken = (string)userReader["UserToken"];
                                    }
                                }
                            }

                            string GetImagesCommand = $"SELECT * FROM ServicesImages WHERE ServiceID = @ServiceID";
                            using (SqlCommand imagesCommand = new SqlCommand(GetImagesCommand, con))
                            {
                                imagesCommand.Parameters.AddWithValue("@ServiceID", ServicesIDs[i]);

                                using (SqlDataReader imageReader = imagesCommand.ExecuteReader())
                                {
                                    List<byte[]> images = new List<byte[]>();
                                    while (imageReader.Read())
                                    {
                                        images.Add((byte[])imageReader["ImageData"]);
                                    }
                                    tempList[i].Images = images.ToArray();
                                }
                            }
                            response.Add(tempList[i]);
                        }
                    }
                }
            }
            return response.ToArray();
        }
        bool isLegitUserWithID(SqlConnection connection, SynergicUser user, out int userID)
        {
            userID = -1;

            string query = "SELECT ID FROM UserAccount WHERE UserToken = @UserToken AND Password = @Password";
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@UserToken", user.UserToken);
                command.Parameters.AddWithValue("@Password", Utils.HashString(user.Password, "SynergicPasswordHashSalt"));

                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        userID = (int)reader["ID"];
                        return true;
                    }
                    else return false;
                }
            }
        }
        int GetServiceID(SqlConnection connection, SynergicService service, int userID)
        {
            int serviceID = -1;

            string query = @"SELECT ServiceID 
                     FROM Services 
                     WHERE OwnerID = @OwnerID 
                     AND ServiceTitle = @ServiceTitle 
                     AND ServicePrice = @ServicePrice 
                     AND ServiceDescription = @ServiceDescription 
                     AND ServiceCategory = @ServiceCategory";

            using (SqlCommand command = new SqlCommand(query, connection))
            {
                // Set parameters
                command.Parameters.AddWithValue("@OwnerID", userID);
                command.Parameters.AddWithValue("@ServiceTitle", service.Title);
                command.Parameters.AddWithValue("@ServicePrice", service.Price);
                command.Parameters.AddWithValue("@ServiceDescription", service.Description);
                command.Parameters.AddWithValue("@ServiceCategory", service.Category);

                connection.Open();
                // Execute the query
                object result = command.ExecuteScalar();

                if (result != null && result != DBNull.Value)
                {
                    serviceID = (int)result;
                }
            }

            return serviceID;
        }

    }
}
