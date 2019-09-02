module.exports = {
	name: "TestSource",
	onload: app => {
		class TestGameSource extends app.gameManager.sourceManager.model() {
			constructor() {
				super();
			}
		
			toObject() {
				super.toObject();
		
				return {
					name: "test"
				};
			}
		}
		
		app.gameManager.sourceManager.register("test", TestGameSource);
	}
}