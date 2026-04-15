using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.DTOs
{
    /// <summary>
    /// 優先度更新リクエスト
    /// </summary>
    public class UpdatePriorityRequest
    {
        /// <summary>
        /// 優先度名
        /// </summary>
        [MinLength(1)]
        [MaxLength(3)]
        public string? Name { get; set; }

        /// <summary>
        /// 文字色
        /// </summary>
        [MaxLength(7)]
        public string? ForegroundColor { get; set; }

        /// <summary>
        /// 背景色
        /// </summary>
        [MaxLength(7)]
        public string? BackgroundColor { get; set; }

        /// <summary>
        /// 表示順
        /// </summary>
        public int? DisplayOrder { get; set; }

        /// <summary>
        /// 論理削除フラグ
        /// </summary>
        public bool? IsDeleted { get; set; }
    }
}
