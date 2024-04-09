namespace SynergicAPI.Models.Responses
{
    public class ProfileResponse : DefaultResponse
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string fName { get; set; }
        public string lName { get; set; }
        public bool Gender { get; set; }
        public string bDate { get; set; }
        public string PhoneNumber { get; set; }
        public string UserToken { get; set; }
        public byte[] ProfilePicture { get; set; }
        public string UserBio { get; set; }
        public string SocialAccounts { get; set; }
    }
}
