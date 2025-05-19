namespace RegistrationForm.Data.DTOs
{
    public class CreateEventDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
    }

}
