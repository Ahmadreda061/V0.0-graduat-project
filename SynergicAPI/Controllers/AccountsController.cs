using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SynergicAPI.Models.Responses;
using SynergicAPI.Models;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace SynergicAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public AccountsController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }


        [HttpGet]
        [Route("GetProfile")]
        public ProfileResponse GetProfile(string UserToken)
        {
            ProfileResponse response = new ProfileResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                string InsertServiceQuery = $"SELECT * FROM UserAccount WHERE UserToken = @UserToken";

                using (SqlCommand command = new SqlCommand(InsertServiceQuery, con))
                {
                    command.Parameters.AddWithValue("@UserToken", UserToken);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if(reader.Read())
                        {
                            response.Email = (string)reader["Email"];
                            response.Username = (string)reader["Username"];
                            response.fName = (string)reader["fName"];
                            response.lName = (string)reader["lName"];
                            response.Gender = (int)reader["Gender"] == 1;
                            response.bDate = (string)reader["bDate"];
                            response.PhoneNumber = (string)reader["PhoneNumber"];
                            response.UserToken = (string)reader["UserToken"];
                            response.ProfilePicture = (byte[])reader["ProfilePicture"];
                        }
                        else
                        {
                            response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                            response.statusMessage = "Provided email was not found in the database";
                        }
                    }
                }
            }
            return response;
        }
    }
}
