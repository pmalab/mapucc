/*
  author:John
  date:2017-03-02
  function:根据仓库的分类，选择仓库，保存到仓库产品
*/
@isTest
private class ChooseHomeControllerTest {
    static testMethod void testMethod1() {
    	Product__c pro = new Product__c();
    	pro.Name='产品';
    	insert pro;
        ApexPages.currentPage().getParameters().put('id',pro.Id);

        //Home__c ho = new Home__c();
        ChooseHomeController chc = new ChooseHomeController();

        chc.ho.BigSort__c = '数码';
        chc.ho.SmallSort__c = '电脑';

       Home__c ho1 = new Home__c();
       ho1.Name = '仓库11';
       ho1.SmallSort__c='电脑';
       ho1.BigSort__c='数码';

       Home__c ho2 = new Home__c();
       ho2.Name = '仓库22';
       ho2.SmallSort__c= '电脑';
       ho2.BigSort__c = '数码';
       insert ho1;
       insert ho2;
        //仓库产品创建个日期
         ProductHome__c ph = new ProductHome__c();
         ph.Name = '仓库产品';
         ph.Date__c = date.today();
         ph.HoPr__c = ho2.Id;
         ph.PrHo__c = pro.Id;
         insert ph;

         
        chc.initData();
  
        //chc.listInnerClass.add(inner);
        for(ChooseHomeController.InnerClass inner01: chc.listInnerClass){
          inner01.isSelect = true;
          inner01.ph = ph;
        }
         // chc.listInnerClass[0].isSelect = true;
         // chc.listInnerClass[0].ph = ph;
        chc.doSave();

       ProductHome__c ph2 = new ProductHome__c();
        ph2.HoPr__c = ho1.Id;
        ph2.PrHo__c = pro.Id;
        insert ph2;
        for(ChooseHomeController.InnerClass inner01: chc.listInnerClass){
          inner01.isSelect = true;
          inner01.ph = ph2;
        }

        chc.doSave();

        chc.doCancel();

    }
}