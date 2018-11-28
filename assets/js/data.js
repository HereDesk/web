export default {
    order_list: [
        {"order_value":"priority","order_name":"优先级"},
        {"order_value":"status","order_name":"状态"},
        {"order_value":"creator_id","order_name":"创建人员"},
        {"order_value":"assignedTo_id","order_name":"指派人员"},
        {"order_value":"fixed_id","order_name":"修复人员"},
        {"order_value":"create_time","order_name":"创建时间"},
        {"order_value":"fixed_time","order_name":"解决时间"},
        {"order_value":"last_time","order_name":"最后更新"}
    ],
    bug_status_list: [
        { "status_value": "all", "status_name": "全部" },
        { "status_value": "New", "status_name": "新建未分配" },
        { "status_value": "Open", "status_name": "待解决" },
        { "status_value": "Reopen", "status_name": "重新打开" },
        { "status_value": "Hang-up", "status_name": "挂起延期" },
        { "status_value": "Fixed", "status_name": "已解决" },
        { "status_value": "Closed", "status_name": "已关闭" }
    ],
    priority_list: [
        { "priority_name":"全部","priority_value":"all" },
        { "priority_name":"P1","priority_value":"P1" },
        { "priority_name":"P2","priority_value":"P2" },
        { "priority_name":"P3","priority_value":"P3" },
        { "priority_name":"P4","priority_value":"P4" },
        { "priority_name":"P5","priority_value":"P5" }
    ],
    bug_quick_operation_list: [
        { "quick_value": "no", "quick_name": "无" },
        { "quick_value": "WaitPending", "quick_name": "待我处理" },
        { "quick_value": "AssignedByMe", "quick_name": "指派给我" },
        { "quick_value": "ResolvedByMe", "quick_name": "我解决的" },
        { "quick_value": "ClosedByMe", "quick_name": "我关闭的" },
        { "quick_value": "CreatedByMe", "quick_name": "我创建的" },
        { "quick_value": "notClosed", "quick_name": "未关闭的" }, // 所有未关闭的
        { "quick_value": "NotResolved", "quick_name": "未解决的" }, // 所有未解决的bug，包括：延期的
        { "quick_value": "HighPriority", "quick_name": "高优先级" }
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