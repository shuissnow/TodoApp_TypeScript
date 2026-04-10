using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TodoApp.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPriorityFeature : Migration
    {
        private static readonly string[] _priorityColumns = ["id", "background_color", "created_at", "display_order", "foreground_color", "name"];

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "priority_id",
                table: "todos",
                type: "char(3)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "priorities",
                columns: table => new
                {
                    id = table.Column<string>(type: "char(3)", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    foreground_color = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    background_color = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_priorities", x => x.id));

            migrationBuilder.InsertData(
                table: "priorities",
                columns: _priorityColumns,
                values: new object[,]
                {
                    { "001", "#FEE2E2", new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), 1, "#EF4444", "高" },
                    { "002", "#FFEDD5", new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), 2, "#F97316", "中" },
                    { "003", "#DBEAFE", new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), 3, "#3B82F6", "低" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_todos_priority_id",
                table: "todos",
                column: "priority_id");

            migrationBuilder.AddForeignKey(
                name: "FK_todos_priorities_priority_id",
                table: "todos",
                column: "priority_id",
                principalTable: "priorities",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.Sql("CREATE UNIQUE INDEX IX_priorities_name_active ON priorities (name) WHERE is_deleted = false;");
            migrationBuilder.Sql("CREATE UNIQUE INDEX IX_priorities_display_order_active ON priorities (display_order) WHERE is_deleted = false;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS IX_priorities_name_active;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS IX_priorities_display_order_active;");

            migrationBuilder.DropForeignKey(
                name: "FK_todos_priorities_priority_id",
                table: "todos");

            migrationBuilder.DropTable(
                name: "priorities");

            migrationBuilder.DropIndex(
                name: "IX_todos_priority_id",
                table: "todos");

            migrationBuilder.DropColumn(
                name: "priority_id",
                table: "todos");
        }
    }
}
