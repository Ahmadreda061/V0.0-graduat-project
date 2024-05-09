namespace SynergicAPI.Models
{
    public class UserReviewContent
    {
        public SynergicUser sender { get; set; }
        public string targetUsername { get; set; }
        public string Review { get; set; }
        public int Rating { get; set; }
    }

}
