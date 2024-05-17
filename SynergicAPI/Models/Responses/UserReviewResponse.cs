namespace SynergicAPI.Models.Responses
{
    public class UserReviewResponse : DefaultResponse
    {
        public LiteUserReviewContent[] contents { get; set; }
    }
    public struct LiteUserReviewContent
    {
        public string senderUsername { get; set; }
        public string targetUsername { get; set; }
        public byte[] senderPP { get; set; }
        public string Review { get; set; }
        public int Rating { get; set; }
    }
}
