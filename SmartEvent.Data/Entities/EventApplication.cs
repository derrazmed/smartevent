using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartEvent.Data.Entities
{
    [Index(nameof(UserId), nameof(EventId), IsUnique = true)]
    public class EventApplication
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime AppliedOn { get; set; } = DateTime.Now;

        [ForeignKey("EventId")]
        public Event? Event { get; set; }

    }
}
