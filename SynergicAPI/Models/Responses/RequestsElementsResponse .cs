namespace SynergicAPI.Models.Responses
{
    public class RequestsElementsResponse : DefaultResponse
    {
        public List<RequestElementData> elements { get; set; }

        public RequestsElementsResponse()
        {
            this.elements = new List<RequestElementData>();
        }
    }
    public class RequestElementData
    {
        public string ServiceOwnerUsername { get; set; }
        public string ServiceRequesterUsername { get; set; }
        public byte[] ServiceRequesterPP { get; set; }
        public int ServiceID { get; set; }
        public int ServicePrice { get; set; }
        public string ServiceTitle { get; set; }
        public string AdditionalComments { get; set; }
    }
}
