namespace SynergicAPI.Models.Responses
{
    public class ActiveServicesResponse : DefaultResponse
    {
        public List<ActiveServiceElementData> elements { get; set; }

        public ActiveServicesResponse()
        {
            this.elements = new List<ActiveServiceElementData>();
        }
    }
    public class ActiveServiceElementData
    {
        public string ServiceOwnerUsername { get; set; }
        public string ServiceCustomerUsername { get; set; }
        public string ServiceName { get; set; }
        public int Price { get; set; }
        public int ServiceID { get; set; }//the service listed on the
        public int ActiveServiceID { get; set; }//the actual service that the vendor is working on for the customer
        public int ActiveServiceChatID { get; set; }//the chat that is corresponded to the current active service
        public bool ActiveStatus { get; set; }
    }
}
