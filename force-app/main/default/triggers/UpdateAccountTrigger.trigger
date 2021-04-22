/*
    作者：John
    时间：2017-02-21
    功能：更新字段
*/
trigger UpdateAccountTrigger on Account(before insert) {
    for(Account a : Trigger.new)    {
        a.Type = 'Prospect';
    }
    

}