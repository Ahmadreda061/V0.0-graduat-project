using Newtonsoft.Json;

namespace SynergicAPI.Models.NotificationTypes
{
    public class ServiceRequestNotificationContent : INotification
    {
        public string senderUsername { get; set; }
        public byte[] senderPP { get; set; }
        public string messageContent { get; set; }
        public DateTime sendTime { get; set; }

        public string Serialize()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}

