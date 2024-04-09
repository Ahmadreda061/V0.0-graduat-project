using Microsoft.AspNetCore.Mvc;
using SynergicAPI.Models;
using SynergicAPI.Models.Responses;
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

                string query = $"SELECT * FROM UserAccount WHERE UserToken = @UserToken";

                using (SqlCommand command = new SqlCommand(query, con))
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
                            response.Gender = (Boolean)reader["Gender"] == true;
                            response.bDate = (string)reader["bDate"];
                            response.PhoneNumber = (string)reader["PhoneNumber"];
                            response.UserToken = (string)reader["UserToken"];
                            response.ProfilePicture = (byte[])reader["ProfilePicture"];
                            response.UserBio = (string)reader["UserBio"];
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

        [HttpPost]
        [Route("SetProfile")]
        public SetProfileResponse SetProfile(SetProfileForm data)
        {
            var response = new SetProfileResponse();
            var validateResult = ValidateDataChange(data);

            string oldToken;
            if (validateResult == Utils.StatusCodings.OK)
            {
                oldToken = data.UserToken;
                using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
                {
                    con.Open();
                    string query = "UPDATE UserAccount SET ";
                    if (data.fName != null) query += "fName = @fName,";
                    if (data.lName != null) query += "lName = @lName,";
                    if (data.Username != null) query += "Username = @Username,";
                    if (data.Email != null) query += "Email = @Email,";
                    if (data.UserBio != null) query += "UserBio = @UserBio,";
                    if (data.ProfilePicture != null) query += "ProfilePicture = @ProfilePicture,";
                    query = query.TrimEnd(',');
                    query += " WHERE UserToken = @UserToken";


                    using (SqlCommand command = new SqlCommand(query, con))
                    {
                        if (data.fName != null) command.Parameters.AddWithValue("@fName", data.fName);
                        if (data.lName != null) command.Parameters.AddWithValue("@lName", data.lName);
                        if (data.Username != null) command.Parameters.AddWithValue("@Username", data.Username);
                        if (data.Email != null) command.Parameters.AddWithValue("@Email", data.Email);
                        if (data.UserBio != null) command.Parameters.AddWithValue("@UserBio", data.UserBio);
                        if (data.ProfilePicture != null) command.Parameters.AddWithValue("@ProfilePicture", data.ProfilePicture);
                        command.Parameters.AddWithValue("@UserToken", data.UserToken);

                        command.ExecuteNonQuery();
                    }

                    if (ChangeToken(data))
                    {
                        query = "SELECT fName, Username, lName FROM UserAccount WHERE UserToken = @UserToken";
                        using (SqlCommand command = new SqlCommand(query, con))
                        {
                            command.Parameters.AddWithValue("@UserToken", oldToken);

                            using (SqlDataReader reader = command.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    string userToken = Utils.HashString((string)reader["fName"] + (string)reader["Username"] + (string)reader["lName"], "TokenHashing");

                                    response.newUserToken = userToken;
                                }
                            }
                        }


                        query = "UPDATE UserAccount SET UserToken = @NewUserToken WHERE UserToken = @OldUserToken";
                        using (SqlCommand command = new SqlCommand(query, con))
                        {
                            command.Parameters.AddWithValue("@NewUserToken", response.newUserToken);
                            command.Parameters.AddWithValue("@OldUserToken", data.UserToken);
                            command.ExecuteNonQuery();
                        }
                    }

                }
            }
            else
            {
                response.newUserToken = data.UserToken;
                response.statusCode = (int)validateResult;

                switch (validateResult)
                {
                    case Utils.StatusCodings.Illegal_Data:
                        response.statusMessage = "Error Validating the Name (Username, First Name or Last Name)!";
                        break;
                    case Utils.StatusCodings.No_Change:
                        response.statusMessage = "Data was not changed!";
                        break;
                    case Utils.StatusCodings.Small_Image:
                        response.statusMessage = "The Profile Picture is too small, minimum is 128x128!";
                        break;
                    case Utils.StatusCodings.Bad_Email_Form:
                        response.statusMessage = "The Email is not in correct form!";
                        break;
                    case Utils.StatusCodings.Email_Used:
                        response.statusMessage = "Email Is already Used!";
                        break;
                    case Utils.StatusCodings.Username_Used:
                        response.statusMessage = "Username Is already Used!";
                        break;
                    default:
                        response.statusMessage = "All OK";
                        break;
                }
            }
            return response;
        }

        private Utils.StatusCodings ValidateDataChange(SetProfileForm data)
        {
            if (data.fName == null && data.lName == null && data.Username == null && data.Email == null && data.UserBio == null && data.ProfilePicture == null) return Utils.StatusCodings.No_Change; //No data change

            if(data.fName != null && !Utils.RegexName(data.fName)) return Utils.StatusCodings.Illegal_Data;
            if(data.lName != null && !Utils.RegexName(data.lName)) return Utils.StatusCodings.Illegal_Data;
            if(data.Username != null && !Utils.RegexName(data.Username)) return Utils.StatusCodings.Illegal_Data;
            if(data.Email != null && !Utils.RegexEmail(data.Email)) return Utils.StatusCodings.Bad_Email_Form;
            if(data.ProfilePicture != null && Utils.DefaultProfileImage.Length > data.ProfilePicture.Length) return Utils.StatusCodings.Small_Image;

            if(data.Username != null || data.Email != null)
            {
                using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
                {
                    con.Open();

                    if(data.Email != null) if (Utils.EmailUsed(con, data.Email)) return Utils.StatusCodings.Email_Used;
                    if(data.Username != null) if (Utils.UsernameUsed(con, data.Username)) return Utils.StatusCodings.Username_Used;
                }
            }

            return Utils.StatusCodings.OK;
        }

        bool ChangeToken(SetProfileForm data)
        {
            return (data.fName != null || data.lName != null || data.Username != null) ;
        }
    }
}
