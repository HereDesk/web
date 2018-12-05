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
    severity_list: [
        { "severity_name":"致命","severity_value":"Fatal" },
        { "severity_name":"严重","severity_value":"Critical" },
        { "severity_name":"一般","severity_value":"Noraml" },
        { "severity_name":"轻微","severity_value":"Minor" },
        { "severity_name":"建议","severity_value":"Suggestion" }
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
        // { "quick_value": "HighPriority", "quick_name": "高优先级" }
    ],
    bug_search_type_list: [
        { "search_value": "ID", "search_name": "缺陷ID" },
        { "search_value": "title", "search_name": "缺陷标题" },
        { "search_value": "severity", "search_name": "严重程度" },
        { "search_value": "bug_type", "search_name": "缺陷类型" },
        { "search_value": "creator_user", "search_name": "创建者" },
        { "search_value": "closed_user", "search_name": "关闭者" },
        { "search_value": "fixed_user", "search_name": "解决者" },
        { "search_value": "assignedTo_user", "search_name": "指派谁" },
        { "search_value": "create_time", "search_name": "创建日期" },
        { "search_value": "closed_time", "search_name": "关闭日期" },
        { "search_value": "fixed_time", "search_name": "解决日期" }
    ]
}