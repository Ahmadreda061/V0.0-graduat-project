namespace SynergicAPI.Models.Responses
{
    public class DefaultResponse
    {
        public int statusCode { get; set; }
        public string statusMessage { get; set; }

        public DefaultResponse()
        {
            statusCode = (int)Utils.StatusCodings.OK;
            statusMessage = "OK";
        }
    }
}
