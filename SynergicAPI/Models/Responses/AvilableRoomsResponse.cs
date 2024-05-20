namespace SynergicAPI.Models.Responses
{
    public class AvilableRoomsResponse : DefaultResponse
    {
        public List<RoomData> rooms { get; set; }
    }
    public class RoomData
    {
        public int RoomID { get; set; }
        public string RoomName { get; set; }
    }
}
