namespace SynergicAPI.Models.Notifications
{
    public class SynergicNotification
    {
        public object content { get; set; }
        public int NotificationID { get; set; }
        public int NotificationCategory { get; set; }
        public bool IsRead { get; set; }
        public string senderName { get; set; }

    }
}
