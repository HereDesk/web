export default {
    bug_status_list: [
        { code: "all", name: "全部" },
        { code: "New", name: "新建未分配" },
        { code: "Open", name: "待解决" },
        { code: "Reopen", name: "重新打开" },
        { code: "Hang-up", name: "挂起延期" },
        { code: "Fixed", name: "已解决" },
        { code: "Closed", name: "已关闭" }
    ],
    priority_list: [
        { "pname":"全部","pvalue":"all" },
        { "pname":"P1","pvalue":"P1" },
        { "pname":"P2","pvalue":"P2" },
        { "pname":"P3","pvalue":"P3" },
        { "pname":"P4","pvalue":"P4" },
        { "pname":"P5","pvalue":"P5" }
    ],
    bug_quick_operation_list: [
        { value: "no", name: "无" },
        { value: "WaitPending", name: "待我处理" },
        { value: "AssignedByMe", name: "指派给我" },
        { value: "ResolvedByMe", name: "我解决的" },
        { value: "ClosedByMe", name: "我关闭的" },
        { value: "CreatedByMe", name: "我创建的" },
        { value: "notClosed", name: "未关闭的" }, // 所有未关闭的
        { value: "NotResolved", name: "未解决的" }, // 所有未解决的bug，包括：延期的
        { value: "HighPriority", name: "高优先级" }
    ],
    bug_search_type_list: [
        { tvalue: "ID", tname: "缺陷ID" },
        { tvalue: "title", tname: "缺陷标题" },
        { tvalue: "severity", tname: "严重程度" },
        { tvalue: "bug_type", tname: "缺陷类型" },
        { tvalue: "creator_user", tname: "创建者" },
        { tvalue: "closed_user", tname: "关闭者" },
        { tvalue: "fixed_user", tname: "解决者" },
        { tvalue: "assignedTo_user", tname: "指派谁" },
        { tvalue: "create_time", tname: "创建日期" },
        { tvalue: "closed_time", tname: "关闭日期" },
        { tvalue: "fixed_time", tname: "解决日期" }
    ]
}