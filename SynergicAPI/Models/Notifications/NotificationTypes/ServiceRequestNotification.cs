namespace SynergicAPI.Models.Notifications.NotificationTypes
{
    public class ServiceRequestNotification
    {
        public string senderUsername { get; set; }
        public byte[] senderPP { get; set; }
        public string messageContent { get; set; }
        public DateTime sendTime { get; set; }
    }
}