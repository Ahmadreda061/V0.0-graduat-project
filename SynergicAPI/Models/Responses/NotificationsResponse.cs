using Newtonsoft.Json;
using SynergicAPI.Models.NotificationTypes;
using System.Drawing;

namespace SynergicAPI.Models.Responses
{
    public class NotificationsResponse : DefaultResponse
    {
        public string[] Notifications { get; set; }
    }
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
}
