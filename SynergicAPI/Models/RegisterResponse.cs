namespace SynergicAPI.Models
{
    public class RegisterResponse
    {
        public int statusCode { get; set; }
        public string statusMessage { get; set; }

        public RegisterResponse()
        {
            statusCode = (int)Utils.StatusCodings.OK;
            statusMessage = "OK";
        }
    }
}
