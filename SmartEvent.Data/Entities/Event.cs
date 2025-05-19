namespace SmartEvent.Data.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public ICollection<EventApplication> Applications { get; set; } = new List<EventApplication>();
    }
}
