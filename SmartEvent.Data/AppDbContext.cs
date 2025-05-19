using Microsoft.EntityFrameworkCore;
using SmartEvent.Data.Entities;
using SmartEvent.Data.Models;

namespace SmartEvent.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventApplication> EventApplication { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EventApplication>()
                .HasOne(ea => ea.Event)
                .WithMany(e => e.Applications)
                .HasForeignKey(ea => ea.EventId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
