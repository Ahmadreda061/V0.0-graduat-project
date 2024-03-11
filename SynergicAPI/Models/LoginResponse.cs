namespace SynergicAPI.Models
{
    public class LoginResponse
    {
        public int statusCode { get; set; }
        public string statusMessage { get; set; }

        public LoginResponse()
        {
            statusCode = (int)Utils.StatusCodings.OK;
            statusMessage = "OK";
        }
    }
}
