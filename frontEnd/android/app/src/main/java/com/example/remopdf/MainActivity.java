package com.example.remopdf;

import android.content.ClipData;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import android.Manifest;
import android.content.pm.PackageManager;

import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import android.webkit.RenderProcessGoneDetail;
import androidx.annotation.RequiresApi;

// ADDED ADMOB IMPORTS
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.concurrent.Executors;

public class MainActivity extends BridgeActivity { 

    private String pendingDataUrl;
    private String pendingMimeType;
    private static final int STORAGE_PERMISSION_CODE = 100;
    
    // ADMOB VARIABLES
    private InterstitialAd mInterstitialAd;
    private AdView mAdView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // INITIALIZE ADMOB
        MobileAds.initialize(this, initializationStatus -> {});
        
        loadInterstitialAd();
        setupBannerAd();

        hideSystemUI();
        setupDownloadListener();
        setupDownloadBridge();

        // Lets you inspect the WebView from Chrome on your PC (chrome://inspect)
        // and see the REAL JavaScript error instead of a generic crash.
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        guardAgainstRendererCrash();
    }

    // --- ADMOB METHODS START ---
    private void loadInterstitialAd() {
        AdRequest adRequest = new AdRequest.Builder().build();
        // Using AdMob Test Interstitial ID
        InterstitialAd.load(this, "ca-app-pub-3940256099942544/1033173712", adRequest,
                new InterstitialAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                        mInterstitialAd = interstitialAd;
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                        Log.e("AdMob", "Failed to load interstitial: " + loadAdError.getMessage());
                        mInterstitialAd = null;
                    }
                });
    }

    private void showInterstitialAd() {
        if (mInterstitialAd != null) {
            mInterstitialAd.show(this);
            loadInterstitialAd(); // Preload the next one after showing
        } else {
            Log.d("AdMob", "The interstitial ad wasn't ready yet.");
        }
    }

private void setupBannerAd() {
        mAdView = new AdView(this);
        mAdView.setAdSize(AdSize.BANNER);
        // Using AdMob Test Banner ID
        mAdView.setAdUnitId("ca-app-pub-3940256099942544/6300978111");

        // FIX: Changed FrameLayout.LayoutParams to CoordinatorLayout.LayoutParams
        CoordinatorLayout.LayoutParams params = new CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.MATCH_PARENT,
                CoordinatorLayout.LayoutParams.WRAP_CONTENT
        );
        params.gravity = Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL;

        // Post to ensure the Bridge's WebView is fully loaded before we attach the Banner
        View decorView = getWindow().getDecorView();
        decorView.post(() -> {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                ViewGroup parent = (ViewGroup) webView.getParent();
                if (parent != null) {
                    parent.addView(mAdView, params);
                    
                    // Add margin to WebView so banner doesn't cover content
                    int bannerHeightPixels = (int) (50 * getResources().getDisplayMetrics().density);
                    ViewGroup.MarginLayoutParams webViewParams = (ViewGroup.MarginLayoutParams) webView.getLayoutParams();
                    webViewParams.bottomMargin = bannerHeightPixels;
                    webView.setLayoutParams(webViewParams);

                    AdRequest adRequest = new AdRequest.Builder().build();
                    mAdView.loadAd(adRequest);
                }
            }
        });
    }
    // --- ADMOB METHODS END ---

    /**
     * When the WebView renderer runs out of memory (big PDF -> many canvases),
     * Android kills the renderer process, and by default that takes the whole app
     * down with it -- what looks like "the app crashed". Handling it keeps the
     * process alive and restarts the UI cleanly.
     */
    private void guardAgainstRendererCrash() {
        View decorView = getWindow().getDecorView();
        decorView.post(() -> {
            WebView webView = getBridge().getWebView();
            if (webView == null) return;
            webView.setWebViewClient(new BridgeWebViewClient(getBridge()) {
                @RequiresApi(api = Build.VERSION_CODES.O)
                @Override
                public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                    Log.e("WebView", "Renderer gone. didCrash=" + detail.didCrash()
                            + " priorityAtExit=" + detail.rendererPriorityAtExit());
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this,
                                "The viewer ran out of memory. Reloading...",
                                Toast.LENGTH_LONG).show();
                        Intent restart = getPackageManager().getLaunchIntentForPackage(getPackageName());
                        if (restart != null) {
                            restart.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(restart);
                        }
                        finish();
                    });
                    return true; // handled -- do NOT let Android kill the app
                }
            });
        });
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    private void setupDownloadListener() {
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.setDownloadListener(new DownloadListener() {
                @Override
                public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                    if (url.startsWith("data:")) {
                        saveBase64ToDownloads(url, mimeType);
                    } else {
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                            startActivity(intent);
                        } catch (Exception e) {
                            Log.e("WebViewDownload", "Cannot open URL: " + url, e);
                        }
                    }
                }
            });
        }
    }

    /**
     * Exposes window.AndroidDownloader to the WebView.
     *
     * The web layer can't reliably save images itself: fetch() to another origin can be
     * blocked by CORS, and <a download href="blob:..."> hands a blob: URL to the
     * DownloadListener above, which only understands data: URLs. So JS just passes the
     * image URL here, we download the real bytes natively, and save them through the
     * same path as the PDF downloads (same permission handling, same Android Toast).
     */
    private void setupDownloadBridge() {
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.addJavascriptInterface(new DownloadBridge(), "AndroidDownloader");
        }
    }

    private class DownloadBridge {
        @JavascriptInterface
        public void saveImageFromUrl(String imageUrl, String fileName) {
            Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    byte[] bytes = fetchImageBytes(imageUrl);

                    String safeName = (fileName == null || fileName.trim().isEmpty()) ? "qrcode.png" : fileName;
                    String base64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
                    String dataUrl = "data:image/png;name=" + URLEncoder.encode(safeName, "UTF-8")
                            + ";base64," + base64;

                    // Reuse the existing save path (storage permission on API 23-28,
                    // MediaStore on 29+, Android Toast, interstitial ad).
                    runOnUiThread(() -> saveBase64ToDownloads(dataUrl, "image/png"));

                } catch (Exception e) {
                    Log.e("WebViewDownload", "Failed to download image: " + imageUrl, e);
                    runOnUiThread(() -> Toast.makeText(MainActivity.this,
                            "Could not download the QR code. Check your connection.",
                            Toast.LENGTH_LONG).show());
                }
            });
        }

        /**
         * Shares the actual PNG (not a link) through the Android share sheet.
         * target: "whatsapp" | "facebook" open that app directly if installed;
         * anything else ("email", "mms", ...) opens the normal chooser.
         */
        @JavascriptInterface
        public void shareImageFromUrl(String imageUrl, String fileName, String target) {
            Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    byte[] bytes = fetchImageBytes(imageUrl);

                    String safeName = (fileName == null || fileName.trim().isEmpty()) ? "qrcode.png" : fileName;
                    safeName = safeName.replaceAll("[^A-Za-z0-9._-]", "_");

                    File dir = new File(getCacheDir(), "shared");
                    if (!dir.exists()) dir.mkdirs();
                    File file = new File(dir, safeName);
                    try (FileOutputStream fos = new FileOutputStream(file)) {
                        fos.write(bytes);
                        fos.flush();
                    }

                    Uri uri = FileProvider.getUriForFile(
                            MainActivity.this, getPackageName() + ".fileprovider", file);

                    runOnUiThread(() -> launchImageShare(uri, target));

                } catch (Exception e) {
                    Log.e("WebViewShare", "Failed to share image: " + imageUrl, e);
                    runOnUiThread(() -> Toast.makeText(MainActivity.this,
                            "Could not share the QR code.",
                            Toast.LENGTH_LONG).show());
                }
            });
        }
    }

    /** Downloads an https image and returns its raw bytes. Call from a background thread. */
    private byte[] fetchImageBytes(String imageUrl) throws IOException {
        if (imageUrl == null || !imageUrl.startsWith("https://")) {
            throw new IOException("Unsupported image URL");
        }

        HttpURLConnection conn = null;
        try {
            conn = (HttpURLConnection) new URL(imageUrl).openConnection();
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);

            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new IOException("HTTP " + conn.getResponseCode());
            }
            String contentType = conn.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IOException("Not an image: " + contentType);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            try (InputStream in = conn.getInputStream()) {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    out.write(buffer, 0, read);
                }
            }
            return out.toByteArray();
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private void launchImageShare(Uri uri, String target) {
        Intent send = new Intent(Intent.ACTION_SEND);
        send.setType("image/png");
        send.putExtra(Intent.EXTRA_STREAM, uri);
        send.setClipData(ClipData.newRawUri("QR Code", uri));
        send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        String pkg = null;
        if ("whatsapp".equals(target)) pkg = "com.whatsapp";
        else if ("facebook".equals(target)) pkg = "com.facebook.katana";

        if (pkg != null) {
            try {
                startActivity(new Intent(send).setPackage(pkg));
                return;
            } catch (Exception e) {
                // App not installed -> fall back to the normal share sheet below
                Log.d("WebViewShare", pkg + " not available, using chooser");
            }
        }

        try {
            startActivity(Intent.createChooser(send, "Share QR Code"));
        } catch (Exception e) {
            Log.e("WebViewShare", "No app can handle the share", e);
            Toast.makeText(this, "No app available to share with", Toast.LENGTH_SHORT).show();
        }
    }

    private void saveBase64ToDownloads(String dataUrl, String defaultMimeType) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                pendingDataUrl = dataUrl;
                pendingMimeType = defaultMimeType;
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, STORAGE_PERMISSION_CODE);
                return; 
            }
        }
        executeDownload(dataUrl, defaultMimeType);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == STORAGE_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                if (pendingDataUrl != null) {
                    executeDownload(pendingDataUrl, pendingMimeType);
                    pendingDataUrl = null;
                }
            } else {
                Toast.makeText(this, "Storage permission denied. Cannot download.", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void executeDownload(String dataUrl, String defaultMimeType) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                String mimeType = defaultMimeType != null ? defaultMimeType : "application/octet-stream";
                if (dataUrl.contains(";") && dataUrl.contains(":")) {
                    mimeType = dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
                }

                String fileName = "RemoPDF_File";
                if (dataUrl.contains(";name=")) {
                    try {
                        String encodedName = dataUrl.substring(dataUrl.indexOf(";name=") + 6, dataUrl.indexOf(";base64"));
                        fileName = URLDecoder.decode(encodedName, "UTF-8");
                    } catch (Exception ignored) {}
                } else {
                    fileName += "application/zip".equals(mimeType) ? ".zip" : ".pdf";
                }

                String base64Payload = dataUrl.substring(dataUrl.indexOf(",") + 1);
                byte[] fileBytes = Base64.decode(base64Payload, Base64.DEFAULT);

                boolean success = false;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
                    values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);
                    values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/RemoPDF");

                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri != null) {
                        try (OutputStream os = getContentResolver().openOutputStream(uri)) {
                            if (os != null) {
                                os.write(fileBytes);
                                os.flush();
                                success = true;
                            }
                        }
                    }
                } else {
                    File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "RemoPDF");
                    if (!dir.exists()) dir.mkdirs();
                    File file = new File(dir, fileName);
                    try (FileOutputStream fos = new FileOutputStream(file)) {
                        fos.write(fileBytes);
                        fos.flush();
                        success = true;
                    }
                }

                final boolean savedSuccessfully = success;
                final String finalFileName = fileName;
                
                runOnUiThread(() -> {
                    if (savedSuccessfully) {
                        Toast.makeText(MainActivity.this, "Saved: " + finalFileName + " to Downloads/RemoPDF", Toast.LENGTH_LONG).show();
                        
                        // TRIGGER INTERSTITIAL AD AFTER SUCCESSFUL DOWNLOAD
                        showInterstitialAd();
                        
                    } else {
                        Toast.makeText(MainActivity.this, "Failed to save file", Toast.LENGTH_SHORT).show();
                    }
                });

            } catch (Exception e) {
                Log.e("WebViewDownload", "Failed to save base64 file", e);
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Download error", Toast.LENGTH_SHORT).show());
            }
        });
    }

    private void hideSystemUI() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController insetsController = getWindow().getInsetsController();
            if (insetsController != null) {
                insetsController.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                insetsController.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }
}