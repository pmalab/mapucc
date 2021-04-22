trigger AccountTrigger01 on Account(before insert) {
    
    for(Account acc : Trigger.new)  {
        if(acc.Name=='张三'){
            acc.Phone='123';
        }
    }
}