namespace SynergicAPI.Models.Responses
{
    public class LoginResponse : DefaultResponse
    {
        public string UserToken { get; set; }
        public string Username { get; set; }
    }
}
