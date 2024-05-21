namespace SynergicAPI.Models.Notifications.NotificationTypes
{
    public class MessagesNotification
    {
        public string senderUsername { get; set; }
        public byte[] senderPP { get; set; }
        public DateTime sendTime { get; set; }
    }
}