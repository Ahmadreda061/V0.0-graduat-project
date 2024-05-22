namespace SynergicAPI.Models.Responses
{
    public class RoomMessagesResponse : DefaultResponse
    {
        public List<RoomMessageData> messages { get; set; }

        public RoomMessagesResponse()
        {
            this.messages = new List<RoomMessageData>();
        }
    }
    public class RoomMessageData
    {
        public int MessageID { get; set; }
        public string SenderName { get; set; }
        public DateTime SendTime { get; set; }
        public string Message { get; set; }
    }
}
