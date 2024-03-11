﻿using Microsoft.AspNetCore.Mvc;
using SynergicAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace SynergicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public RegisterController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        [HttpPost]
        [Route("Register")]
        public RegisterResponse Register(Registration registration)
        {
            RegisterResponse response = new RegisterResponse();
            registration.Password = Utils.HashString(registration.Password); //Hash the password for security reasons.

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
                                       "VALUES (@Email, @Username, @Password, @IsActive, @IsVendor, @FirstName, @LastName, @Gender, @BirthDate, @PhoneNumber)";

                using (SqlCommand insertCommand = new SqlCommand(query, con))
                {
                    insertCommand.Parameters.AddWithValue("@Email", registration.Email);
                    insertCommand.Parameters.AddWithValue("@Username", registration.Username);
                    insertCommand.Parameters.AddWithValue("@Password", registration.Password);
                    insertCommand.Parameters.AddWithValue("@IsActive", 1);
                    insertCommand.Parameters.AddWithValue("@IsVendor", 0);
                    insertCommand.Parameters.AddWithValue("@FirstName", registration.fName);
                    insertCommand.Parameters.AddWithValue("@LastName", registration.lName);
                    insertCommand.Parameters.AddWithValue("@Gender", registration.Gender ? 1 : 0);
                    insertCommand.Parameters.AddWithValue("@BirthDate", registration.bDate);
                    insertCommand.Parameters.AddWithValue("@PhoneNumber", registration.PhoneNumber);

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
