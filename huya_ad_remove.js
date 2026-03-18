/**
 * 虎牙直播去广告脚本
 * 用于过滤虎牙直播APP接口返回中的广告数据
 * 适用于 Loon / Surge / QuantumultX
 */

const url = $request.url;
let body = $response.body;

try {
  if (body) {
    let obj = JSON.parse(body);
    
    // 过滤开屏广告
    if (obj.data && obj.data.splashAd) {
      obj.data.splashAd = null;
    }
    if (obj.data && obj.data.splash) {
      obj.data.splash = null;
    }
    if (obj.data && obj.data.splashList) {
      obj.data.splashList = [];
    }
    
    // 过滤首页信息流广告卡片
    if (obj.data && obj.data.list && Array.isArray(obj.data.list)) {
      obj.data.list = obj.data.list.filter(item => {
        if (!item) return true;
        // 过滤带有广告标记的卡片
        if (item.adType || item.isAd || item.ad_type || item.adId || item.isAdvert) return false;
        if (item.type === 'ad' || item.type === 'advert' || item.type === 'advertisement') return false;
        if (item.cardType === 'ad' || item.cardType === 'advert') return false;
        if (item.templateType === 'ad' || item.templateType === 'adCard') return false;
        return true;
      });
    }
    
    // 过滤推荐列表中的广告
    if (obj.data && obj.data.datas && Array.isArray(obj.data.datas)) {
      obj.data.datas = obj.data.datas.filter(item => {
        if (!item) return true;
        if (item.adType || item.isAd || item.ad_type || item.adId || item.isAdvert) return false;
        if (item.type === 'ad' || item.type === 'advert') return false;
        if (item.iGameAd) return false;
        return true;
      });
    }

    // 过滤广告配置
    if (obj.data && obj.data.adConfig) {
      obj.data.adConfig = null;
    }
    if (obj.data && obj.data.adInfo) {
      obj.data.adInfo = null;
    }
    if (obj.data && obj.data.ads) {
      obj.data.ads = [];
    }
    if (obj.data && obj.data.advertList) {
      obj.data.advertList = [];
    }
    
    // 过滤弹窗广告
    if (obj.data && obj.data.popup) {
      obj.data.popup = null;
    }
    if (obj.data && obj.data.popupAd) {
      obj.data.popupAd = null;
    }
    if (obj.data && obj.data.dialog) {
      if (obj.data.dialog.adType || obj.data.dialog.isAd) {
        obj.data.dialog = null;
      }
    }
    
    // 过滤横幅广告
    if (obj.data && obj.data.banner) {
      if (Array.isArray(obj.data.banner)) {
        obj.data.banner = obj.data.banner.filter(item => {
          if (!item) return true;
          return !(item.adType || item.isAd || item.type === 'ad');
        });
      }
    }
    
    // 过滤浮窗广告
    if (obj.data && obj.data.floatAd) {
      obj.data.floatAd = null;
    }
    if (obj.data && obj.data.floatLayer) {
      obj.data.floatLayer = null;
    }

    body = JSON.stringify(obj);
  }
} catch (e) {
  // 非JSON格式，跳过处理
}

$done({ body });
