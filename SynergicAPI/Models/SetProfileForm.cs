namespace SynergicAPI.Models
{
    public class SetProfileForm
    {
        public string UserToken { get; set; }
        public string? fName { get; set; }
        public string? lName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? UserBio { get; set; }
        public string? SocialAccounts { get; set; }
        public byte[]? ProfilePicture { get; set; }
    }
}
