namespace SynergicAPI.Models.Responses
{
    public class UserRatingResponse : DefaultResponse
    {
        public int Rating { get; set; }

        public UserRatingResponse(int rating)
        {
            Rating = rating;
        }
    }
}
