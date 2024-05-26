namespace SynergicAPI.Models.Responses
{
    public class ServiceElementsResponse : DefaultResponse
    {
        public List<ServiceElementData> elements { get; set; }

        public ServiceElementsResponse()
        {
            this.elements = new List<ServiceElementData>();
        }
    }
    public class ServiceElementData
    {
        public string ServiceOwnerUsername { get; set; }
        public byte[] ServiceOwnerPP { get; set; }
        public string Title { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public int Category { get; set; }
        public byte[][] Images { get; set; } //In base 64 form
        public int ServiceID { get; set; }
    }
}
