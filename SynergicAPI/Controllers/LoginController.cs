using Microsoft.AspNetCore.Mvc;
using SynergicAPI.Models;
using System.Data.SqlClient;
using System.Data;

namespace SynergicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public LoginController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        [HttpPost]
        [Route("Login")]
        public LoginResponse Login(Login loginInfo)
        {
            bool isEmail = Utils.RegexEmail(loginInfo.Email_or_Username); //Check whether the input is in email form or username form.

            LoginResponse response = new LoginResponse();
            loginInfo.Password = Utils.HashString(loginInfo.Password);//Hash the password for security reasons.

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                string query;
                if (isEmail)
                    query = "SELECT * FROM UserAccount WHERE Email = @Email";
                else
                    query = "SELECT * FROM UserAccount WHERE Username = @Username";

                using (SqlCommand command = new SqlCommand(query, con))
                {
                    if (isEmail)
                        command.Parameters.AddWithValue("@Email", loginInfo.Email_or_Username);
                    else
                        command.Parameters.AddWithValue("@Username", loginInfo.Email_or_Username);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (!reader.HasRows) // Account not found.
                        {
                            response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                            response.statusMessage = "Account not found";
                        }
                        else
                        {
                            reader.Read();
                            string passwordFromDb = reader["Password"].ToString();
                            if (!passwordFromDb.Equals(loginInfo.Password)) // Password is incorrect.
                            {
                                response.statusCode = (int)Utils.StatusCodings.Password_Incorrect;
                                response.statusMessage = "Password is incorrect";
                            }
                            else if ((int)reader["IsActive"] == 0) // Account is inactive.
                            {
                                response.statusCode = (int)Utils.StatusCodings.Account_Suspended;
                                response.statusMessage = "Account is suspended";
                            }
                        }
                    }
                }
            }

            return response;
        }
    }
}
