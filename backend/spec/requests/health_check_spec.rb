require "rails_helper"

RSpec.describe "ヘルスチェック", type: :request do
  describe "GET /up" do
    it "200を返す" do
      get rails_health_check_path

      expect(response).to have_http_status(:ok)
    end
  end
end
