((global) => {
	const cacheKey = "umami-share-cache";
	const cacheTTL = 3600_000; // 1h

	async function fetchShareData(baseUrl, shareId) {
		const cached = localStorage.getItem(cacheKey);
		if (cached) {
			try {
				const parsed = JSON.parse(cached);
				if (Date.now() - parsed.timestamp < cacheTTL) {
					return parsed.value;
				}
			} catch {
				localStorage.removeItem(cacheKey);
			}
		}
		const res = await fetch(`${baseUrl}/api/share/${shareId}`);
		if (!res.ok) {
			throw new Error("获取 Umami 分享信息失败");
		}
		const data = await res.json();
		localStorage.setItem(
			cacheKey,
			JSON.stringify({ timestamp: Date.now(), value: data }),
		);
		return data;
	}

	/**
	 * 获取 Umami 分享数据（websiteId、token）
	 * 在缓存 TTL 内复用；并用全局 Promise 避免并发请求
	 * @param {string} baseUrl
	 * @param {string} shareId
	 * @returns {Promise<{websiteId: string, token: string}>}
	 */
	global.getUmamiShareData = (baseUrl, shareId) => {
		if (!global.__umamiSharePromise) {
			global.__umamiSharePromise = fetchShareData(baseUrl, shareId).catch(
				(err) => {
					delete global.__umamiSharePromise;
					throw err;
				},
			);
		}
		return global.__umamiSharePromise;
	};

	global.clearUmamiShareCache = () => {
		localStorage.removeItem(cacheKey);
		delete global.__umamiSharePromise;
	};

	// 初始化全局缓存 Map
	if (!global.__umamiDataCache) {
		global.__umamiDataCache = new Map();
	}

	/**
	 * 获取 Umami 统计数据
	 * 自动处理 token 获取和过期重试
	 * @param {string} baseUrl
	 * @param {string} shareId
	 * @param {object} queryParams
	 * @returns {Promise<any>}
	 */
	global.fetchUmamiStats = async (baseUrl, shareId, queryParams) => {
		// 生成缓存键：baseUrl + shareId + queryParams的字符串表示
		const cacheKey = `${baseUrl}|${shareId}|${JSON.stringify(queryParams)}`;
		
		// 检查全局内存缓存
		if (global.__umamiDataCache.has(cacheKey)) {
            const data = global.__umamiDataCache.get(cacheKey);
            // 标记数据来自缓存
            return { ...data, _fromCache: true };
		}

		async function doFetch(isRetry = false) {
			const { websiteId, token } = await global.getUmamiShareData(
				baseUrl,
				shareId,
			);
			const currentTimestamp = Date.now();
			const params = new URLSearchParams({
				startAt: 0,
				endAt: currentTimestamp,
				unit: "hour",
				timezone: queryParams.timezone || "Asia/Shanghai",
				compare: false,
				...queryParams,
			});

			const statsUrl = `${baseUrl}/api/websites/${websiteId}/stats?${params.toString()}`;

			const res = await fetch(statsUrl, {
				headers: {
					"x-umami-share-token": token,
				},
			});

			if (!res.ok) {
				if (res.status === 401 && !isRetry) {
					global.clearUmamiShareCache();
					return doFetch(true);
				}
				throw new Error("获取统计数据失败");
			}

			const data = await res.json();
			// 写入全局缓存
			global.__umamiDataCache.set(cacheKey, data);
			return data;
		}

		return doFetch();
	};
})(window);
