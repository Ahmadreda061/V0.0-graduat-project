using Microsoft.AspNetCore.Mvc;
using SynergicAPI.Models;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;

namespace SynergicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAuthenticationController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public UserAuthenticationController(IConfiguration _configuration)
        {
            // Determine the path to the image file

            configuration = _configuration;
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
            if (!Utils.RegexName(registration.Username) || !Utils.RegexName(registration.fName) || !Utils.RegexName(registration.lName)) //The Name (UName, FName, LName) is in incorrect form.
            {
                response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                response.statusMessage = "Incorrect (Username, FName, LName) form!";
                return response;
            }
            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
            {
                con.Open();

                if (Utils.AccountExists(con, registration.Username, registration.Email)) //Checks whether the email or username is already used.
                {
                    response.statusCode = (int)Utils.StatusCodings.Email_Or_User_Used;
                    response.statusMessage = "Email or Username has already been used!";
                    return response;
                }

                string query = $"INSERT INTO {Utils.UserAccountString} " +
                                       "VALUES (@Email, @Username, @Password, @IsActive, @IsVendor, @FirstName, @LastName, @Gender, @BirthDate, @PhoneNumber, @UserToken, @ProfileResponse, @UserBio)";
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
                    insertCommand.Parameters.AddWithValue("@ProfileResponse", Utils.DefaultProfileImage);
                    insertCommand.Parameters.AddWithValue("@UserBio", "empty!");

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

        [HttpPost]
        [Route("SignPaymentInfo")]
        public DefaultResponse SignPayment(PaymentInfo info)
        {
            DefaultResponse response = new DefaultResponse();
            info.user.Password = Utils.HashString(info.user.Password, "SynergicPasswordHashSalt");//Hash the password for security reasons.

            if (!ValidateCardInfo(info))
            {
                response.statusCode = (int)Utils.StatusCodings.Invalid_Card_Info;
                response.statusMessage = "Provided Info Not Correct!";
            }
            else
            {
                using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon").ToString())) //Create connection with the database.
                {
                    con.Open();
                    bool added = true;
                    if (info.IsVendor)
                    {
                        string query = "UPDATE UserAccount SET IsVendor = @IsVendor WHERE (Username = @Username AND Password = @Password AND UserToken = @UserToken)";
                        using (SqlCommand command = new SqlCommand(query, con))
                        {
                            command.Parameters.AddWithValue("@IsVendor", true);
                            command.Parameters.AddWithValue("@Username", info.user.Username);
                            command.Parameters.AddWithValue("@Password", info.user.Password);
                            command.Parameters.AddWithValue("@UserToken", info.user.UserToken);

                            int altered = command.ExecuteNonQuery();
                            if (altered == 0)
                            {
                                response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                                response.statusMessage = "Account not valid or not found!";//This Shouldn't be reached unless the user altered some data illegaly
                                added = false;
                            }
                        }
                    }

                    if (added)
                    {
                        string query = $"INSERT INTO {Utils.PaymentAccountString} VALUES((SELECT ID FROM UserAccount WHERE Username LIKE @Username), @CardholderName, @cardNumber, @expMonth, @expYear, @CVC)";

                        using (SqlCommand command = new SqlCommand(query, con))
                        {
                            command.Parameters.AddWithValue("@Username", info.user.Username);
                            command.Parameters.AddWithValue("@CardholderName", info.CardholderName);
                            command.Parameters.AddWithValue("@cardNumber", info.CardNumber);
                            command.Parameters.AddWithValue("@expMonth", info.expMonth);
                            command.Parameters.AddWithValue("@expYear", info.expYear);
                            command.Parameters.AddWithValue("@CVC", info.CVC);

                            int altered = command.ExecuteNonQuery();
                            if (altered == 0)
                            {
                                response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                                response.statusMessage = "How did we get here?";//This Shouldn't be reached
                            }
                        }
                    }
                }
            }
            return response;
        }

        private bool ValidateCardInfo(PaymentInfo info)
        {
            if (string.IsNullOrEmpty(info.CardholderName) ||
                string.IsNullOrEmpty(info.CardNumber) ||
                info.expMonth < 1 || info.expMonth > 12 ||
                info.expYear < DateTime.Now.Year % 100 || (info.expYear == DateTime.Now.Year % 100 && info.expMonth < DateTime.Now.Month) ||
                info.CVC <= 0)
            {
                return false;
            }

            if (!IsLuhnValid(info.CardNumber))
            {
                return false;
            }

            return true;
        }

        private bool IsLuhnValid(string cardNumber)
        {
            // Remove non-digit characters
            cardNumber = cardNumber.Replace(" ", "").Replace("-", "");

            // Convert the card number string into an array of digits
            int[] digits = cardNumber.Select(c => c - '0').ToArray();

            // Double every second digit from right to left. If doubling of a digit results in a two-digit number,
            // add up the two digits to get a single-digit number (treat the two digits as individual numbers)
            for (int i = digits.Length - 2; i >= 0; i -= 2)
            {
                int doubled = digits[i] * 2;
                if (doubled > 9)
                {
                    doubled = doubled % 10 + doubled / 10;
                }
                digits[i] = doubled;
            }

            // Sum all the digits
            int sum = digits.Sum();

            // If the sum is a multiple of 10, then the card number is valid according to the Luhn algorithm
            return sum % 10 == 0;
        }
    }
}
