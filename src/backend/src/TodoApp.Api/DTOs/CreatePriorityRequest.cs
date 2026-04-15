using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TodoApp.Api.DTOs
{
    public class CreatePriorityRequest
    {
        /// <summary>
        /// 一意識別子
        /// </summary>
        [Required]
        public string Id { get; set; } = string.Empty;

        /// <summary>
        /// 優先度名
        /// </summary>
        [Required]
        [MinLength(1)]
        [MaxLength(3)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// 文字色
        /// </summary>
        [Required]
        [MaxLength(7)]
        public string ForegroundColor { get; set; } = string.Empty;

        /// <summary>
        /// 背景色
        /// </summary>
        [Required]
        [MaxLength(7)]
        public string BackgroundColor { get; set; } = string.Empty;

        /// <summary>
        /// 表示順
        /// </summary>
        [JsonRequired]
        public int DisplayOrder { get; set; }

        /// <summary>
        /// 論理削除フラグ
        /// </summary>
        [JsonRequired]
        public bool IsDeleted { get; set; }
    }
}
