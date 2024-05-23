namespace SynergicAPI.Models.Responses
{
    public class UserRatingResponse : DefaultResponse
    {
        public float Rating { get; set; }

        public UserRatingResponse(int rating)
        {
            Rating = rating;
        }
    }
}
