using Newtonsoft.Json;
using SynergicAPI.Models.Responses;

namespace SynergicAPI.Models.NotificationTypes
{
    public class ServiceRequestNotification : INotification
    {
        public ServiceRequestNotificationContent content { get; set; }
        public int NotificationID { get; set; }
        public int NotificationCategory { get; set; }
        public bool IsRead { get; set; }

        public string Serialize()
        {
            return JsonConvert.SerializeObject(this);
        }
    }

    public class ServiceRequestNotificationContent
    {
        public string senderUsername { get; set; }
        public byte[] senderPP { get; set; }
        public string messageContent { get; set; }
        public DateTime sendTime { get; set; }
    }
}