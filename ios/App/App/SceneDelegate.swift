import UIKit
import Capacitor
import AppTrackingTransparency

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    /// ATT isteği bu süreçte bir kez gönderildi mi (tekrar istekte bulunmak için cevabın gerçekten alınmamış olması gerekir).
    private var trackingRequestInFlight = false

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = CAPBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    /// App Store reddi (6 Ekim 2026, 1.0 build 10, iOS/iPadOS 27.2): ATT
    /// penceresi hiç görünmüyordu — izin hiçbir yerde istenmiyordu. İzin
    /// burada, sahne gerçekten aktif olduktan sonra ve ana iş parçacığında
    /// isteniyor: iOS, uygulama aktif değilken ya da başka bir sistem
    /// penceresi (ör. Game Center girişi) açıkken yapılan isteği pencere
    /// göstermeden sessizce yutar. Bu yüzden JS tarafı (src/data/tracking.ts)
    /// Game Center ve AdMob'u bu cevap gelene kadar başlatmıyor. İstek
    /// yutulursa (durum hâlâ "notDetermined") bir sonraki aktif oluşta
    /// yeniden denenir.
    func sceneDidBecomeActive(_ scene: UIScene) {
        requestTrackingIfNeeded()
    }

    private func requestTrackingIfNeeded() {
        guard ATTrackingManager.trackingAuthorizationStatus == .notDetermined, !trackingRequestInFlight else { return }
        trackingRequestInFlight = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
            guard UIApplication.shared.applicationState == .active,
                  ATTrackingManager.trackingAuthorizationStatus == .notDetermined else {
                self?.trackingRequestInFlight = false
                return
            }
            ATTrackingManager.requestTrackingAuthorization { _ in
                DispatchQueue.main.async {
                    self?.trackingRequestInFlight = false
                }
            }
        }
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}
