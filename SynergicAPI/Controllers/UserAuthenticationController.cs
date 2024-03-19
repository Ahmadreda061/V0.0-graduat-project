using Microsoft.AspNetCore.Mvc;
using SynergicAPI.Models;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;
using System.Drawing;

namespace SynergicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAuthenticationController : ControllerBase
    {
        private readonly IConfiguration configuration;
        byte[] DefaultProfileImage;

        public UserAuthenticationController(IConfiguration _configuration)
        {
            // Determine the path to the image file
            string imagePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources", "DefaultProfileImage.png");

            configuration = _configuration;

            var img = new Bitmap(imagePath);
            DefaultProfileImage = Utils.BitmapToByteArray(img, System.Drawing.Imaging.ImageFormat.Png);
        }

        [HttpPost]
        [Route("Register")]
        public DefaultResponse Register(Registration registration)
        {
            DefaultResponse response = new DefaultResponse();
            if(registration.Password.Length < 8)
            {
                response.statusCode = (int)Utils.StatusCodings.Short_Password;
                response.statusMessage = "Password need to be 8 characters at-least!";
            }    
            registration.Password = Utils.HashString(registration.Password, "SynergicPasswordHashSalt"); //Hash the password for security reasons.

            if (!Utils.RegexEmail(registration.Email)) //The Email is in incorrect form.
            {
                response.statusCode = (int)Utils.StatusCodings.Bad_Email_Form;
                response.statusMessage = "Incorrect Email form!";
                return response;
            }

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                if (UserExists(con, registration)) //Checks whether the email or username is already used.
                {
                    response.statusCode = (int)Utils.StatusCodings.Email_Or_User_Used;
                    response.statusMessage = "Email or Username has already been used!";
                    return response;
                }

                string query = $"INSERT INTO {Utils.UserAccountString} " +
                                       "VALUES (@Email, @Username, @Password, @IsActive, @IsVendor, @FirstName, @LastName, @Gender, @BirthDate, @PhoneNumber, @UserToken, @ProfileResponse)";
                string userToken = Utils.HashString(registration.fName + registration.Username + registration.lName, "TokenHashing");

                using (SqlCommand insertCommand = new SqlCommand(query, con))
                {
                    insertCommand.Parameters.AddWithValue("@Email", registration.Email);
                    insertCommand.Parameters.AddWithValue("@Username", registration.Username);
                    insertCommand.Parameters.AddWithValue("@Password", registration.Password);
                    insertCommand.Parameters.AddWithValue("@IsActive", true);
                    insertCommand.Parameters.AddWithValue("@IsVendor", false);
                    insertCommand.Parameters.AddWithValue("@FirstName", registration.fName);
                    insertCommand.Parameters.AddWithValue("@LastName", registration.lName);
                    insertCommand.Parameters.AddWithValue("@Gender", registration.Gender);
                    insertCommand.Parameters.AddWithValue("@BirthDate", registration.bDate);
                    insertCommand.Parameters.AddWithValue("@PhoneNumber", registration.PhoneNumber);
                    insertCommand.Parameters.AddWithValue("@UserToken", userToken);
                    insertCommand.Parameters.AddWithValue("@ProfileResponse", DefaultProfileImage);

                    int rowsAffected = insertCommand.ExecuteNonQuery();

                    if (rowsAffected <= 0)//Query failed to execute.
                    {
                        response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                        response.statusMessage = "Registration Error: An unexpected error has occurred while registering!";
                    }
                }
            }

            return response;
        }

        [HttpPost]
        [Route("Login")]
        public LoginResponse Login(Login loginInfo)
        {
            bool isEmail = Utils.RegexEmail(loginInfo.Email_or_Username); //Check whether the input is in email form or username form.

            LoginResponse response = new LoginResponse();
            loginInfo.Password = Utils.HashString(loginInfo.Password, "SynergicPasswordHashSalt");//Hash the password for security reasons.

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
                            else if (!(bool)reader["IsActive"]) // Account is inactive.
                            {
                                response.statusCode = (int)Utils.StatusCodings.Account_Suspended;
                                response.statusMessage = "Account is suspended";
                            }
                            else // All Good
                                response.UserToken = (string)reader["UserToken"];
                        }
                    }
                }
            }

            return response;
        }

        bool UserExists(SqlConnection connection, Registration registration)
        {
            string query = "SELECT COUNT(*) FROM UserAccount WHERE Email = @Email OR Username = @Username";
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Email", registration.Email);
                command.Parameters.AddWithValue("@Username", registration.Username);
                int count = (int)command.ExecuteScalar();
                return count > 0;
            }
        }
    }
}
