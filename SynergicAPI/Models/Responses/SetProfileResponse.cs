namespace SynergicAPI.Models.Responses
{
    public class SetProfileResponse : DefaultResponse
    {
        public string newUserToken { get; set; }
        public string? newUsername { get; set; }
    }
}
