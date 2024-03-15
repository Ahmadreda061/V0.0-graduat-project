namespace SynergicAPI.Models.Responses
{
    public class LoginResponse : DefaultResponse
    {
        public string UserToken { get; set; }

        public LoginResponse()
        {
            statusCode = (int)Utils.StatusCodings.OK;
            statusMessage = "OK";
        }
    }
}
