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
        public ProfileResponse GetProfile(string Username)
        {
            ProfileResponse response = new ProfileResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                string query = $"SELECT * FROM UserAccount WHERE Username = @Username";

                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@Username", Username);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if(reader.Read())
                        {
                            response.Email = (string)reader["Email"];
                            response.Username = (string)reader["Username"];
                            response.IsVendor = (bool)reader["IsVendor"];
                            response.fName = (string)reader["fName"];
                            response.lName = (string)reader["lName"];
                            response.Gender = (bool)reader["Gender"] == true;
                            response.bDate = (string)reader["bDate"];
                            response.PhoneNumber = (string)reader["PhoneNumber"];
                            response.UserToken = (string)reader["UserToken"];
                            response.ProfilePicture = (byte[])reader["ProfilePicture"];
                            response.UserBio = (string)reader["UserBio"];
                            response.SocialAccounts = (string)reader["SocialAccounts"];
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
                    if (data.SocialAccounts != null) query += "SocialAccounts = @SocialAccounts,";
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
                        if (data.SocialAccounts != null) command.Parameters.AddWithValue("@SocialAccounts", data.SocialAccounts);
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

        [HttpPost]
        [Route("PostReview")]
        public DefaultResponse PostReview(UserReviewContent data)
        {
            var response = new DefaultResponse();

            if(data.Rating < 1 || data.Rating > 10)
            {
                response.statusCode = ((int)Utils.StatusCodings.Illegal_Data);
                response.statusMessage = $"Got rating {data.Rating}, when the allowed value should be between 1 and 10";
                return response;
            }

            if (data.Review.Length == 0 || data.Review.Length > 256)
            {
                response.statusCode = ((int)Utils.StatusCodings.Illegal_Data);
                response.statusMessage = $"Got Review with length {data.Review.Length}, when the allowed length is between 1 and 256";
                return response;
            }

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                if(!Utils.IsLegitUserTokenWithID(con, data.senderToken, out int writerID))
                {
                    response.statusCode = ((int)Utils.StatusCodings.Account_Not_Found);
                    response.statusMessage = "The sender account couldn't be found!";
                    return response;
                }
                if (!Utils.UsernameToUserID(con, data.targetUsername, out int recieverID))
                {
                    response.statusCode = ((int)Utils.StatusCodings.Account_Not_Found);
                    response.statusMessage = "The reciever account couldn't be found!";
                    return response;
                }

                string query = $"INSERT INTO {Utils.ReviewString} VALUES(@WriterID, @TargetID, @Review, @Rating)";
                using(SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@WriterID", writerID);
                    cmd.Parameters.AddWithValue("@TargetID", recieverID);
                    cmd.Parameters.AddWithValue("@Review", data.Review);
                    cmd.Parameters.AddWithValue("@Rating", data.Rating);
                    int added = cmd.ExecuteNonQuery();
                    if(added == 0)
                    {
                        response.statusCode = ((int)Utils.StatusCodings.Unknown_Error);
                        response.statusMessage = "Review couldn't be added!";
                        return response;
                    }
                }
            }

            return response;
        }

        [HttpGet]
        [Route("GetReview")]
        public UserReviewResponse GetUserReviews(string username)
        {
            UserReviewResponse response = new UserReviewResponse();
            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                if (!Utils.UsernameToUserID(con, username, out int recieverID))
                {
                    response.statusCode = ((int)Utils.StatusCodings.Account_Not_Found);
                    response.statusMessage = "The user couldn't be found!";
                    return response;
                }

                string query = $"SELECT * FROM UserReview WHERE TargetID LIKE @TargetID";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@TargetID", recieverID);
                    List<(int, int, string, int)> contents = new List<(int, int, string, int)>();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            contents.Add(((int)reader["WriterID"], (int)reader["TargetID"], (string)reader["Review"], (int)reader["Rating"]));
                        }
                    }

                    response.contents = contents.Select((v) => {
                        return new LiteUserReviewContent()
                        {
                            senderUsername = Utils.UserIDToUsername(con, v.Item1),
                            targetUsername = Utils.UserIDToUsername(con, v.Item2),
                            senderPP = Utils.UserIDToProfilePicture(con, v.Item1),
                            Review = v.Item3,
                            Rating = v.Item4,
                        };
                    }).ToArray();
                }
            }
            return response;
        }


        [HttpGet]
        [Route("GetRating")]
        public UserRatingResponse GetUserRating(string username)
        {
            UserRatingResponse response = new UserRatingResponse(5);

            UserReviewResponse revResponse = GetUserReviews(username);
            if(revResponse.statusCode != (int) Utils.StatusCodings.OK)
            {
                response.statusCode = revResponse.statusCode;
                response.statusMessage = revResponse.statusMessage;
                return response;
            }

            if (revResponse.contents.Length == 0)
                return response;


            int rating = 0;
            foreach (var item in revResponse.contents)
            {
                rating += item.Rating;
            }
            rating /= revResponse.contents.Length;

            response.Rating = rating;
            return response;
        }
    }
}
