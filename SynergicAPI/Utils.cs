using System.Text.RegularExpressions;

namespace SynergicAPI
{
    public static class Utils
    {
        /// <summary>
        /// The UserAccount form in the Database.
        /// </summary>
        public static string UserAccountString => "UserAccount(Email, Username, Password, IsActive, IsVendor, fName, lName, Gender, bDate, PhoneNumber, UserToken)";
        public static string ServicesString => "Services(OwnerID, ServiceTitle, ServicePrice, ServiceDescription, ServiceCategory)";
        public static string ServicesImagesString => "ServicesImages(ServiceID, ImageData)";

        public enum StatusCodings
        {
            Unknown_Error = -1,
            OK = 0,//No error occured
            Email_Not_Found = 1,//The given email was not found on the db
            Email_Or_User_Used = 2,//The provided email/username is already used in another account
            Bad_Email_Form = 3,//The given Email is not in the correct form ex:mail@provider.domain
            Account_Suspended = 4,//The account has been banned/suspended IsActive=0 in the db
            Password_Incorrect = 5,//Self Explained
            Account_Not_Found = 6,//The account not found for login
            Illegal_Data = 7,//The data are not as expected.
            Short_Password = 8,//Self Explained
        }

        /// <summary>
        /// Use this to hash a string (non reversable procedure).
        /// </summary>
        /// <param name="text">the input string to hash</param>
        /// <param name="salt">the 'salt' to add to the hashing, it is prefered to use a salt for mor security.</param>
        /// <returns></returns>
        public static string HashString(string text, string salt)
        {
            if (string.IsNullOrEmpty(text))
            {
                return string.Empty;
            }

            // Using SHA256 to create the hash
            using (var sha = new System.Security.Cryptography.SHA256Managed())
            {
                // Convert the string to a byte array first, to be processed
                byte[] textBytes = System.Text.Encoding.UTF8.GetBytes(text + salt);
                byte[] hashBytes = sha.ComputeHash(textBytes);

                // Convert back to a string, removing the '-' that BitConverter adds
                string hash = BitConverter
                    .ToString(hashBytes)
                    .Replace("-", String.Empty);

                return hash;
            }
        }
        /// <summary>
        /// Detirmines weather the input string is in the form of an email or not.
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static bool RegexEmail(string text)
        {
            return Regex.IsMatch(text, @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
        }
    }
}
