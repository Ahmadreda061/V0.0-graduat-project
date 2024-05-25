namespace SynergicAPI.Models.Notifications.NotificationTypes
{
    public class ReviewNotification
    {
        public byte[] senderPP { get; set; }
        public string messageContent { get; set; }
        public DateTime sendTime { get; set; }
    }
}