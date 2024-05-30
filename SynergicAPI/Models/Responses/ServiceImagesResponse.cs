namespace SynergicAPI.Models.Responses
{
    public class ServiceImagesResponse : DefaultResponse
    {
        public List<byte[]> Images { get; set; }

        public ServiceImagesResponse()
        {
            Images = new List<byte[]>();
        }
    }
}
